import { useState, useEffect } from "react"
import fillStar from "./../assets/fillStart.png"
import unFillStar from "./../assets/unFillStar.png"

interface RepositoryProps {
    name: string;
    language: string;
    lastUpdate: string;
    index: number;
    repositoriesStars: boolean[];
    setRepositoriesStars: (newStars: boolean[]) => void;
    userName: string;
}

const Repository = ({ repositoriesStars, userName, setRepositoriesStars, name, language, lastUpdate, index }: RepositoryProps) => {
    const [marked, setMarked] = useState<boolean>(() => {
        return repositoriesStars[index] || false;
    });

    useEffect(() => {
        setMarked(repositoriesStars[index] || false);
    }, [repositoriesStars, index]); 

    const handleStarClick = () => {
        const newStars = repositoriesStars.map((star, i) => (i === index ? !star : star));
        localStorage.setItem(userName, JSON.stringify(newStars));
        setRepositoriesStars(newStars);
        setMarked(newStars[index]);
    };

    return (
        <div className="repository">
            <a className="repositoryLink" target="_blank" href={`https://github.com/${userName}/${name}`}>
                <strong>{name}</strong>
                <div className="column1">
                    <span>{language}</span>
                    <span>{lastUpdate}</span>
                </div>
            </a>
            <div className="star">
                {
                    marked
                        ? <img onClick={handleStarClick} id="starIcon" src={fillStar} alt="Filled star" />
                        : <img onClick={handleStarClick} id="starIcon" src={unFillStar} alt="Unfilled star" />
                }
            </div>
        </div>
    );
}

export default Repository;
