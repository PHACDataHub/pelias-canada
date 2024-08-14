import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { parse } from "papaparse";
import { RiArrowDropDownLine } from "react-icons/ri";
import "./FAQ.css";
import { Link } from "react-router-dom";
import { GcdsHeading } from "@cdssnc/gcds-components-react";

// AccordionItem component for displaying each FAQ item
const AccordionItem = ({ question, answer, isOpen, onClick }) => {
	// useRef to dynamically adjust content height
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
			<button className={`question-container ${isOpen ? "active" : ""}`} onClick={onClick}>
				<p className="question-content">{question}</p>
				<RiArrowDropDownLine className={`arrow ${isOpen ? "active" : ""}`} />
			</button>
			<div ref={contentHeight} className="answer-container">
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

	useEffect(() => {
		const fetchCSVData = async () => {
			try {
				const response = await fetch("assets/FAQ.csv");
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
			}
		};

		fetchCSVData();
	}, []);

	const handleItemClick = (categoryIndex, itemIndex) => {
		setActiveIndices(prevIndices => ({
			...prevIndices,
			[categoryIndex]: prevIndices[categoryIndex] === itemIndex ? null : itemIndex,
		}));
	};

	return (
		<div className="container">
			<GcdsHeading tag="h1">Frequently Asked Questions</GcdsHeading>
			<div className="tableOfContents">
				<ul className="tableOfContentsList">
					{jsonData &&
						Object.keys(jsonData).map((category, categoryIndex) => (
							<Link
								key={categoryIndex}
								className="tableOfContentsListItem"
								to={`#${category}`}
								style={{ textDecoration: "none", color: "#333333" }}
							>
								{category}
							</Link>
						))}
				</ul>
			</div>
			{jsonData &&
				Object.keys(jsonData).map((category, categoryIndex) => (
					<section key={categoryIndex} id={category} className="category-container">
						<h2 >{category}</h2>
						<ul style={{ listStyleType: "none" }}>
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
