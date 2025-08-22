import RoomCanvas from "@/components/pages/canvas/RoomCanvas";

export default async function canvasPage({params} : {params : {
    slug : string
}}){
    
    const slug = (await params).slug;


    
    return <RoomCanvas roomId={slug} />
}