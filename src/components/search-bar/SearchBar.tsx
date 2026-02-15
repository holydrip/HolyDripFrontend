import Styles from "./search-bar.module.css"
import Image from "next/image"

export function SearchBar(){
    return (
        <div className={Styles.searchBar}>
            <input className={Styles.input} type="text" placeholder="Пошук..."/>
            <Image src={"/images/search-icon.svg"} alt="icon" width={30} height={30}></Image>
        </div>
    )
}