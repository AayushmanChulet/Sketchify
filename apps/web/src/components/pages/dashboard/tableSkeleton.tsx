import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AllCanvasSkeleton(){
    return<div className="w-full overflow-x-auto">
      <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">sno.</TableHead>
          <TableHead className="w-3/5">Name</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead className="text-right">Join canvas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Skeleton className="h-5 w-8 rounded" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-64 rounded" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 rounded" />
                </TableCell>
                <TableCell className="place-items-end">
                  <Skeleton className="h-5 w-12 rounded" />
                </TableCell>
              </TableRow>
            ))
          }
      </TableBody>
    </Table>
    </div> 
}