import { useEffect, useState } from "react";
import { fetchAllPokemon, fetchPokemonSpeciesByName, fetchPokemonDetailsByName, fetchEvolutionChainById } from "./api";

function App() {
    const [pokemonIndex, setPokemonIndex] = useState([])
    const [pokemon, setPokemon] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [pokemonDetails, setPokemonDetails] = useState()

    useEffect(() => {
        const fetchPokemon = async () => {
            const {results: pokemonList} = await fetchAllPokemon()

            setPokemon(pokemonList)
            setPokemonIndex(pokemonList)
        }

        fetchPokemon().then(() => {
            /** noop **/
        })
    }, [])

    useEffect(() => {
        setPokemon(
            pokemonIndex.filter(
                (monster) => monster.name.indexOf(searchValue.toLowerCase()) !== -1
            )
        );
    }, [searchValue, pokemonIndex]);
    

    const onSearchValueChange = (event) => {
        const value = event.target.value
        setSearchValue(value)
    }

    const onGetDetails = (name) => async () => {
        try{
            const species = await fetchPokemonSpeciesByName(name)
            const details = await fetchPokemonDetailsByName(name);
            const evolution = await fetchEvolutionChainById(species.id);

            setPokemonDetails({
                'name':details.name,
                'moves': details.moves.slice(0, 4),
                'types': details.types,
                'evolution':evolution.chain.evolves_to
            });  
        }
        catch{
            console.log('error')
        }
              
    }

    return (
        <div className={'pokedex__container'}>
            <div className={'pokedex__search-input'}>
                <input value={searchValue} onChange={onSearchValueChange} placeholder={'Search Pokemon'}/>
            </div>
            <div className={'pokedex__content'}>
                {pokemon.length > 0 ? (
                    <div className={'pokedex__search-results'}>
                        {
                            pokemon.map(monster => {
                                return (
                                    <div className={'pokedex__list-item'} key={monster.name}>
                                        <div>
                                            {monster.name}
                                        </div>
                                        <button onClick={onGetDetails(monster.name)}>Get Details</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : (
                    <div className={"pokedex__search-results"}>No Results Found</div>
                )}
                {
                    pokemonDetails && (
                        <article className={'pokedex__details'}>
                            <h2>{pokemonDetails.name}</h2>
                            <section className="pokedex__types">
                                <h3>Types</h3>
                                <ul>
                                    {
                                      pokemonDetails.types.map(slot => <li>{slot.type.name}</li>)
                                    }
                                </ul>
                            </section>
                            <section className="pokedex__moves">
                                <h3>Moves</h3>
                                <ul>
                                    {
                                      pokemonDetails.moves.map(slot => <li>{slot.move.name}</li>)
                                    }
                                </ul>
                            </section>
                            <section className="pokedex__evolution">
                                <h3>Evolutions</h3>
                                <ul>
                                    {
                                      pokemonDetails.evolution.map(monster => <li>{monster.species.name}</li>)
                                    }
                                </ul>
                            </section>
                        </article>
                    )
                }
            </div>
        </div>
    );
}

export default App;
