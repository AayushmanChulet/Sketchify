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
    return <Table className="w-full h-full">
      <TableCaption>All canvas'.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">sno.</TableHead>
          <TableHead className="w-4/6">Name</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead className="text-right">Join canvas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.data.map((room, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{index+1}</TableCell>
            <TableCell>{room.slug}</TableCell>
            <TableCell>{new Date(room.createdAt).toLocaleTimeString()}</TableCell>
            <TableCell className="text-right text-blue-700">{<Link href={`${FRONTEND_URL}/canvas/${room.id}`}>Join</Link>}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
}