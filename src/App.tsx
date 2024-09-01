import { useEffect, useRef, useState } from 'react';
import './App.css';
import Repository from './components/Repository';

interface RepositoryData {
  id: number;
  name: string;
  language: string;
  updated_at: string;
}

function App() {
  const userNameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>('kauamb2');
  const [userPhoto, setUserPhoto] = useState<string>('https://avatars.githubusercontent.com/u/95621020?v=4');
  const [repositories, setRepositories] = useState<RepositoryData[]>([]);
  const [repositoriesStars, setRepositoriesStars] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRepositories = await fetch(`https://api.github.com/users/${name}/repos`);
        if (!responseRepositories.ok){
          const errorData=await responseRepositories.json()
          alert(errorData.message)
          return
        }
        
        const dataRepositories: RepositoryData[] = await responseRepositories.json();
        setRepositories(dataRepositories);

        const responseProfile = await fetch(`https://api.github.com/users/${name}`);
        if (!responseProfile.ok) throw new Error('Failed to fetch profile');
        
        const dataProfile = await responseProfile.json();
        setUserPhoto(dataProfile.avatar_url);

        const storedArray = localStorage.getItem(name);
        if (storedArray) {
          setRepositoriesStars(JSON.parse(storedArray));
        } else {
          const newStars = dataRepositories.map(() => false);
          setRepositoriesStars(newStars);
          localStorage.setItem(name, JSON.stringify(newStars));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [name]);

  const handleSearchClick = async () => {
    const currentUserName = userNameRef.current?.value || '';
    try {
      const response = await fetch(`https://api.github.com/users/${currentUserName}`);
      if (response.ok) {
        setName(currentUserName);
      } else {
        alert('Profile not found');
      }
    } catch (error) {
      console.error(error);
      alert('Error fetching profile');
    }
  };

  return (
    <>
      <div id="inputDiv">
        <div id="inputColumn">
          <strong>Type here the profile username:</strong>
          <br />
          <input ref={userNameRef} placeholder="Type here..." />
        </div>
        <button onClick={handleSearchClick} id="searchButton">Search</button>
      </div>
      <div id="mainContainer">
        <div id="userInfo">
          <a id="profileLink" target='_blank' href={`https://github.com/${name}`}>
            <img id="userPhoto" src={userPhoto} alt="User profile" />
          </a>
          <div id="userName">
            <a target='_blank' href={`https://github.com/${name}`}>{name}</a>
          </div>
        </div>
        <div id="repositoriesComponent">
          {repositories.map((repository, index) => (
            <Repository
              key={repository.id}
              userName={name}
              repositoriesStars={repositoriesStars}
              setRepositoriesStars={setRepositoriesStars}
              index={index}
              name={repository.name}
              language={repository.language}
              lastUpdate={repository.updated_at}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
