interface Props {
    slug : string,
    createdAt : Date
}

export default function RecentCanvas ( props : Props ) {
    return <div className="w-96 h-48 bg-sky-600 text-neutral-200 rounded-2xl flex flex-col justify-between items-start p-7">
        <div className="text-2xl">{props.slug}</div>
        <div className="text-xl">created at: {props.createdAt.toLocaleDateString()}</div>
    </div>
}