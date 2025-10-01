import React from "react"
import ReactDOM from "react-dom"
import "../styles/details.css"

const Detail = ({title, items}) => {
    return(
        <div>
            <div className="detailTitle profileExtra">
                {title}
            </div>
            <ul>
                {items.map(item => {
                    return <li key={item}>{item}</li>
                })}
            </ul>
        </div>
    )
}

export default Detail;