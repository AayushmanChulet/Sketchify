import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FRONTEND_URL } from "@repo/config/config";
import Link from "next/link";

interface Props{
    data : {
        id : number,
        slug : string,
        createdAt : string
    }[]
}

export default function AllCanvas( props : Props ) {
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
        {props.data.map((room, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index+1}</TableCell>
            <TableCell className="truncate">{room.slug}</TableCell>
            <TableCell>{new Date(room.createdAt).toLocaleTimeString()}</TableCell>
            <TableCell className="text-right text-blue-700">{<Link href={`${FRONTEND_URL}/canvas/${room.id}`}>Join</Link>}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
}