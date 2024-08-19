import { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { parse } from "papaparse";
import { RiArrowDropDownLine } from "react-icons/ri";
import "./FAQ.css";
import { GcdsHeading } from "@cdssnc/gcds-components-react";
import { useTranslation } from 'react-i18next';

// AccordionItem component for displaying each FAQ item
const AccordionItem = ({ question, answer, isOpen, onClick }) => {
    const contentHeight = useRef(null);

    useEffect(() => {
        if (isOpen && contentHeight.current) {
            contentHeight.current.style.height = `${contentHeight.current.scrollHeight}px`;
        } else if (contentHeight.current) {
            contentHeight.current.style.height = "0px";
        }
    }, [isOpen]);

    return (
        <div className="wrapper">
            <button
                className={`question-container ${isOpen ? "active" : ""}`}
                onClick={onClick}
                aria-expanded={isOpen}
                aria-controls={`answer-${question}`}
                id={`question-${question}`}
                tabIndex="0"
            >
                <p className="question-content">{question}</p>
                <RiArrowDropDownLine
                    className={`arrow ${isOpen ? "active" : ""}`}
                    aria-hidden="true"
                />
            </button>
            <div
                ref={contentHeight}
                className="answer-container"
                id={`answer-${question}`}
                aria-labelledby={`question-${question}`}
                role="region"
                aria-hidden={!isOpen}
            >
                <p className="answer-content">{answer}</p>
            </div>
        </div>
    );
};

AccordionItem.propTypes = {
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default function FAQ() {
    const [jsonData, setJsonData] = useState(null);
    const [activeIndices, setActiveIndices] = useState({});
    const [loading, setLoading] = useState(true);
    const { i18n, t } = useTranslation();

    const fetchCSVData = useCallback(async () => {
        try {
            setLoading(true);
            const language = i18n.language;
            const csvFilePath = language === 'fr' ? "locales/fr/FAQ-fr.csv" : "locales/en/FAQ-en.csv";

            const response = await fetch(csvFilePath);
            const reader = response.body.getReader();
            const result = await reader.read();
            const decoder = new TextDecoder("utf-8");
            const csvString = decoder.decode(result.value);
            const parsedData = parse(csvString, { header: true }).data;
            const filteredData = parsedData.filter(item => item.Categories && item.Categories.trim() !== "");
            const groupedData = filteredData.reduce((acc, item) => {
                const category = item.Categories;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(item);
                return acc;
            }, {});

            const initialActiveIndices = Object.keys(groupedData).reduce((acc, category, index) => {
                acc[index] = null;
                return acc;
            }, {});

            setJsonData(groupedData);
            setActiveIndices(initialActiveIndices);
        } catch (error) {
            console.error("Error fetching or parsing CSV file:", error);
        } finally {
            setLoading(false);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchCSVData();

        i18n.on('languageChanged', fetchCSVData);
        return () => {
            i18n.off('languageChanged', fetchCSVData);
        };
    }, [fetchCSVData, i18n]);

    const handleItemClick = useCallback((categoryIndex, itemIndex) => {
        setActiveIndices(prevIndices => ({
            ...prevIndices,
            [categoryIndex]: prevIndices[categoryIndex] === itemIndex ? null : itemIndex,
        }));
    }, []);

    const handleNavigationClick = useCallback((event, category) => {
        event.preventDefault();
        const element = document.getElementById(category);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <div>
            <GcdsHeading tag="h1">{t("pages.faq.title")}</GcdsHeading>
            <div className="tableOfContents">
                <GcdsHeading tag="h2">{t("pages.faq.nav")}</GcdsHeading>
                <ul className="tableOfContentsList">
                    {loading ? <p>Loading...</p> :
                        jsonData && Object.keys(jsonData).map((category, categoryIndex) => (
                            <li key={categoryIndex} className="tableOfContentsListItem">
                                <a
                                    href={`#${category}`}
                                    onClick={(event) => handleNavigationClick(event, category)}
                                    aria-label={`Navigate to ${category} section`}
                                >
                                    {category}
                                </a>
                            </li>
                        ))}
                </ul>
            </div>
            {jsonData && Object.keys(jsonData).map((category, categoryIndex) => (
                <section key={categoryIndex} id={category} className="category-container">
                    <GcdsHeading tag="h3">{category}</GcdsHeading>
                    <ul className="listItem">
                        {jsonData[category].map((item, itemIndex) => (
                            <li key={itemIndex}>
                                <AccordionItem
                                    question={item.Question}
                                    answer={item.Answer}
                                    isOpen={activeIndices[categoryIndex] === itemIndex}
                                    onClick={() => handleItemClick(categoryIndex, itemIndex)}
                                />
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}
