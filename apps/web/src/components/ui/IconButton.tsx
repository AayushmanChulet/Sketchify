import { ReactElement } from "react"

interface Props {
  onClick: () => void
  isActivated: boolean
  icon: ReactElement
}

export default function IconButton(props: Props) {
  return (
    <div
      onClick={props.onClick}
      className={`p-4 m-2 cursor-pointer rounded-full border
        ${props.isActivated ? "bg-neutral-500" : "bg-neutral-700"}
        text-neutral-200 hover:bg-neutral-600`}
    >
      {props.icon}
    </div>
  )
}
