import React from 'react';
import '../styles/CustomPagination.css'

const CustomPagination = ({ selectedPage, totalPages, pageChangeHandler }) => {
    const renderPageNumbers = () => {
        const pages = [];
        const range = 2;

        let lowRange = Math.max(1, selectedPage - range);
        let highRange = Math.min(selectedPage + range, totalPages);

        if (lowRange > selectedPage - range) {
            highRange = Math.min(highRange - (selectedPage - range) + lowRange, totalPages);
        } else if (highRange < selectedPage + range) {
            lowRange = Math.max(lowRange - (selectedPage + range) + highRange, 1);
        }

        pages.push(
            <span key="first"
                disabled={selectedPage === 1}
                onClick={() => pageChangeHandler(1)}
                className={`custom-pagination-item ${selectedPage === 1 ? 'disabled' : ''}`}>
                ❮
            </span>,
            <span key="prev"
                disabled={selectedPage === 1}
                onClick={() => pageChangeHandler(selectedPage - 1)}
                className={`custom-pagination-item ${selectedPage === 1 ? 'disabled' : ''}`}>
                ‹
            </span>
        );

        for (let index = lowRange; index <= highRange; index++) {
            pages.push(
                <span
                    key={index}
                    onClick={() => pageChangeHandler(index)}
                    className={`custom-pagination-item ${selectedPage === index ? 'active' : ''}`}
                >
                    {index}
                </span>
            );
        }

        pages.push(
            <span key="next"
                disabled={selectedPage === totalPages}
                onClick={() => pageChangeHandler(selectedPage + 1)}
                className={`custom-pagination-item ${selectedPage === totalPages ? 'disabled' : ''}`}>
                ›
            </span>,
            <span key="last"
                disabled={selectedPage === totalPages}
                onClick={() => pageChangeHandler(totalPages)}
                className={`custom-pagination-item ${selectedPage === totalPages ? 'disabled' : ''}`}>
                ❯
            </span>
        );

        return pages;
    };

    return (
        <div className="custom-pagination">
            <span>{renderPageNumbers()}</span>
        </div>
    );
};

export default CustomPagination;