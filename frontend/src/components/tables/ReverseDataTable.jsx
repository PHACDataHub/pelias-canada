import { useTranslation } from 'react-i18next';
import {
  GcdsButton,
  GcdsHeading,
  GcdsSelect,
} from '@cdssnc/gcds-components-react';
import React, { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import './Tables.css';

export default function ReversePaginatedTable({ apiResults }) {
  const { t, i18n } = useTranslation();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const getPageNumbersToDisplay = (totalPages, currentPage) => {
    const maxVisiblePages = 5;
    const pages = [];

    pages.push(1);

    if (currentPage > Math.floor(maxVisiblePages / 2) + 2) {
      pages.push('...');
    }

    const startPage = Math.max(
      2,
      currentPage - Math.floor(maxVisiblePages / 2),
    );
    const endPage = Math.min(
      totalPages - 1,
      currentPage + Math.floor(maxVisiblePages / 2),
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - Math.floor(maxVisiblePages / 2) - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const totalItems = apiResults.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = apiResults.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <GcdsSelect
        selectId={t('components.tablePageation.itemsID')}
        label={t('components.tablePageation.itemsPerPage')}
        name={t('components.tablePageation.itemsID')}
        hint={t('components.tablePageation.hint')}
        onGcdsChange={(e) => {
          const newItemsPerPage = Number(e.target.value);
          setItemsPerPage(newItemsPerPage);
          setCurrentPage(1);
        }}
        lang={i18n.language}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </GcdsSelect>
      <table>
        <caption>
          {i18n.language === 'en'
            ? `Displaying Items ${startIndex + 1} - ${endIndex} of ${totalItems}`
            : `Affichage des articles ${startIndex + 1} - ${endIndex} de ${totalItems}`}
        </caption>
        <thead>
          <tr>
            <th scope="col">
              {t('components.forwardBulk.mapReady.outputTable.inputID')}
            </th>
            <th scope="col">rank</th>
            <th scope="col">
              {t('components.forwardBulk.mapReady.outputTable.address')}
            </th>
            <th scope="col">
              {t('components.forwardBulk.mapReady.outputTable.lat')}
            </th>
            <th scope="col">
              {t('components.forwardBulk.mapReady.outputTable.lon')}
            </th>
            <th scope="col">
              {t('components.forwardBulk.mapReady.outputTable.confidenceLevel')}
            </th>
            <th scope="col">
              {t('components.forwardBulk.mapReady.outputTable.accuracy')}
            </th>
            <th scope="col">dist from org</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((result, index) => {
            // The result object itself represents a feature
            const feature = result?.result;
            const coordinates = feature?.geometry?.coordinates;
            const latitude = coordinates ? coordinates[1] : 'N/A'; // Latitude
            const longitude = coordinates ? coordinates[0] : 'N/A'; // Longitude
            const confidence =
              feature?.properties?.confidence !== undefined
                ? `${feature.properties.confidence * 100}%`
                : 'N/A';
            const accuracy = feature?.properties?.accuracy || 'N/A';
            const physicalAddress = feature?.properties?.label || 'N/A'; // Correctly access address
            const dist = feature?.properties?.distance || 'N/A';
            const featureIndex = result?.featureIndex;

            return (
              <tr
                key={index}
                style={{ background: index % 2 === 0 ? '#ffffff' : '#e0e0e0' }}
              >
                <td>{result?.inputID || 'N/A'}</td>
                <td>{featureIndex + 1}</td>
                <td>{physicalAddress}</td>
                <td>{latitude}</td>
                <td>{longitude}</td>
                <td>{confidence}</td>
                <td>{accuracy}</td>
                <td>{dist} km</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {totalPages > 1 && (
        <nav aria-label="Pagination">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              paddingTop: '16px',
              width: 'full',
              flexWrap: 'wrap',
            }}
          >
            {getPageNumbersToDisplay(totalPages, currentPage).map(
              (page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span aria-hidden="true">...</span>
                  ) : (
                    <GcdsButton
                      size="small"
                      buttonRole={
                        currentPage === page ? 'primary' : 'secondary'
                      }
                      onClick={() => handlePageChange(page)}
                      aria-label={`${t('components.tablePageation.goToPage')} ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </GcdsButton>
                  )}
                </React.Fragment>
              ),
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px',
              width: 'full',
              flexWrap: 'wrap',
            }}
          >
            {currentPage > 1 && (
              <GcdsButton
                size="small"
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label={t('components.tablePageation.ariaPrevious')}
              >
                <FaAngleLeft /> {t('components.tablePageation.previous')}
              </GcdsButton>
            )}

            {currentPage < totalPages && (
              <GcdsButton
                size="small"
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label={t('components.tablePageation.ariaNext')}
              >
                {t('components.tablePageation.next')} <FaAngleRight />
              </GcdsButton>
            )}
          </div>
        </nav>
      )}
      <div className="sr-only" aria-live="polite" role="status">
        {i18n.language === 'en'
          ? `Page ${currentPage} of ${totalPages}`
          : `Page ${currentPage} de ${totalPages}`}
      </div>
    </>
  );
}
