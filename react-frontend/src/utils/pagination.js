import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({ selectedPage, totalPages, handler }) => {
    const renderPageNumbers = () => {
        const pages = [];
        const range = 2;

        let lowrange = Math.max(1, selectedPage - range);
        let highrange = Math.min(selectedPage + range, totalPages);

        if (lowrange > selectedPage - range) {
            highrange = Math.min(highrange - selectedPage + range + lowrange, totalPages);
        } else if (highrange < selectedPage + range) {
            lowrange = Math.max(lowrange - selectedPage - range + highrange, 1);
        }

        pages.push(
            <Pagination.First key="first" onClick={() => handler(1)} />,
            <Pagination.Prev key="prev" disabled={selectedPage === 1} onClick={() => handler(selectedPage - 1)} />
        );

        for (let index = lowrange; index <= highrange; index++) {
            pages.push(
                <Pagination.Item key={index} active={index === selectedPage} onClick={() => handler(index)}>
                    {index}
                </Pagination.Item>
            );
        }

        pages.push(
            <Pagination.Next key="next" disabled={selectedPage === totalPages} onClick={() => handler(selectedPage + 1)} />,
            <Pagination.Last key="last" onClick={() => handler(totalPages)} />
        );

        return pages;
    };

    return <Pagination className="justify-content-md-center">{renderPageNumbers()}</Pagination>;
};

export default CustomPagination;
