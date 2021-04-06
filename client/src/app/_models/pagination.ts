export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    toatlItems: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    result: T;//list of member
    pagination: Pagination;//pagination information
}