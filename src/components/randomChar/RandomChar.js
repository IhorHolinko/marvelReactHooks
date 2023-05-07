import { useState, useEffect } from 'react';
// import Spinner from '../../resources/spinner/Spinner';
// import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent'; // for FSMachine

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

    const [char, setChar] = useState(null);
    const {loading, error, getCharacter, clearError, process, setProcess} = useMarvelService() // process, setProcess for FSMachine

    useEffect(() => {
        updateChar();
        const timeId = setInterval(updateChar, 60000);

        return () => {
            clearInterval(timeId)
        }
    }, []);

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError()
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed')); // for FSMachine

    }

    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading ? <Spinner/> : null;
    // const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="randomchar">
            {setContent(process, View, char)}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    ) // for FSMachine

    // return (
    //     <div className="randomchar">
    //         {errorMessage}
    //         {spinner}
    //         {content}
    //         <div className="randomchar__static">
    //             <p className="randomchar__title">
    //                 Random character for today!<br/>
    //                 Do you want to get to know him better?
    //             </p>
    //             <p className="randomchar__title">
    //                 Or choose another one
    //             </p>
    //             <button onClick={updateChar} className="button button__main">
    //                 <div className="inner">try it</div>
    //             </button>
    //             <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
    //         </div>
    //     </div>
    // )
}

// const View = ({char}) => {
//     const {name, description, thumbnail, homepage, wiki} = char;

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki} = data; // for FSMachine

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' || 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <div className="randomchar__block">
        <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
        <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
                {description}
            </p>
            <div className="randomchar__btns">
                <a href={homepage} className="button button__main">
                    <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
                    <div className="inner">Wiki</div>
                </a>
            </div>
        </div>
    </div>
    );
}

export default RandomChar;