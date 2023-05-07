import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types'

import Spinner from "../../resources/spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../../services/MarvelService";
import './comicsList.scss'

const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>
            break;
        case 'confirmed':
            return <Component/>;
            break;
        case 'error':
            return <ErrorMessage/>;
            break;
        default:
            throw new Error('Unexpected process state')
    }
}    // for FSMachine

const ComicsList = (props) => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics, process, setProcess} = useMarvelService(); // process and setProcess for FSMachine

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed')); // for FSMachine
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]); // something other
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }

    // const itemRefs = useRef([]);

    // const focusOnItem = (id) => {
    //     itemRefs.current.forEach(item => item.classList.remove('comics__item_selected'));
    //     itemRefs.current[id].classList.add('comics__item_selected');
    //     itemRefs.current[id].focus()
    // }

    // function renderItems(arr) {
    //     const items =  arr.map((item, i) => {
    //         // let imgStyle = {'objectFit' : 'cover'};
    //         // if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
    //         //     imgStyle = {'objectFit' : 'unset'};
    //         // }
            
    //         return (
    //             <li 
    //                 className="comics__grid"
    //                 tabIndex={0}
    //                 ref={el => itemRefs.current[i] = el}
    //                 key={item.id}
    //                 onClick={() => {
    //                     props.onComicsSelected(item.id);
    //                     focusOnItem(i);
    //                 }}
    //                 onKeyPress={(e) => {
    //                     if (e.key === ' ' || e.key === "Enter") {
    //                         props.onComicsSelected(item.id);
    //                         focusOnItem(i);
    //                     }
    //                 }}>
    //                     <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
    //                     <div className="comics__name">{item.name}</div>
    //             </li>
    //         )
    //     });

    //     return (
    //         <ul className="comics__grid">
    //             {items}
    //         </ul>
    //     )
    // }

    function renderItems (arr) {
        const items = arr.map((item, i) => {
            
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
        
    // const items = renderItems(comicsList);

    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicsList), newItemLoading)}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    ) //for SFMachine

    // return (
    //     <div className="comics__list">
    //         {errorMessage}
    //         {spinner}
    //         {items}
    //         <button 
    //             className="button button__main button__long"
    //             disabled={newItemLoading}
    //             style={{'display': comicsEnded ? 'none' : 'block'}}
    //             onClick={() => onRequest(offset)}>
    //             <div className="inner">load more</div>
    //         </button>
    //     </div>
    // )
}

// ComicsList.propTypes = {
//     onComicsSelected: PropTypes.func.isRequired
// }

export default ComicsList;