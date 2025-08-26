interface Props {
    slug : string,
    createdAt : Date
}

export default function RecentCanvas ( props : Props ) {
    return <div className="ww-full sm:w-80 lg:w-96 h-40 sm:h-48 bg-sky-600 text-neutral-200 rounded-xl flex flex-col justify-between items-start p-5">
        <div className="text-lg sm:text-2xl break-words">{props.slug}</div>
        <div className="text-sm sm:text-xl">created at: {props.createdAt.toLocaleDateString()}</div>
    </div>
}