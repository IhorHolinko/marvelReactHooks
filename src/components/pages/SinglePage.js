import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
// import Spinner from '../../resources/spinner/Spinner';
// import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from "../appBanner/AppBanner";
import setContent from '../../utils/setContent'; // for FSMachine


const SinglePage = ({Component, dataType}) => {
        const {id} = useParams();
        const [data, setData] = useState(null);
        const {loading, error, getComic, getCharacter, clearError, process, setProcess} = useMarvelService(); // for FSMachine

        useEffect(() => {
            updateData()
        }, [id])

        const updateData = () => {
            clearError();

            switch (dataType) {
                case 'comic':
                    getComic(id).then(onDataLoaded)
                    .then(() => setProcess('confirmed')); // for FSMachine

                    break;
                case 'character':
                    getCharacter(id).then(onDataLoaded)
                    .then(() => setProcess('confirmed')); // for FSMachine

            }
        }

        const onDataLoaded = (data) => {
            setData(data);
        }

        // const errorMessage = error ? <ErrorMessage/> : null;
        // const spinner = loading ? <Spinner/> : null;
        // const content = !(loading || error || !data) ? <Component data={data}/> : null;

        return (
            <>
                <AppBanner/>
                {setContent(process, Component, data)}
            </>
        ) // for FSMachine
        // return (
        //     <>
        //         <AppBanner/>
        //         {errorMessage}
        //         {spinner}
        //         {content}
        //     </>
        // )
}

export default SinglePage;