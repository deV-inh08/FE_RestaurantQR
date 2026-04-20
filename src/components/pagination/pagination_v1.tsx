import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/src/components/ui/pagination"
const PaginationV1 = () => {
    return (

        <div className="border-t border-border-subtle p-4">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            className="border border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground rounded-md"
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            isActive
                            className="rounded-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            className="border border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground rounded-md"
                        >
                            2
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            className="border border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground rounded-md"
                        >
                            3
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            className="border border-border-subtle bg-transparent text-foreground hover:bg-gold-subtle hover:text-foreground rounded-md"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default PaginationV1;