import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AllCanvasSkeleton(){
    return <Table className="w-full h-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">sno.</TableHead>
          <TableHead className="w-4/6">Name</TableHead>
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
}