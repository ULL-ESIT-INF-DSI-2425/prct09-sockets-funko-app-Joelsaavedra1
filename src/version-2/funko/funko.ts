/**
 * Enum that represents the type of a Funko
 */
export enum FunkoType {
  POP = "Pop!",
  POP_RIDES = "Pop! Rides",
  VYNIL_SODA = "Vynil Soda",
  VYNIL_GOLD = "Vynil Gold",
}

/**
 * Enum that represents the genre of a Funko
 */
export enum FunkoGenre {
  ANIME = "Anime",
  MOVIES_TV = "Movies and TV",
  VIDEOGAMES = "Videogames",
  SPORTS = "Sports",
  MUSIC = "Music",
}

/**
 * Interface that represents a Funko
 * A Funko has the following elements:
 * - ID: Identifier of the Funko
 * - name: Name of the Funko
 * - description: Description of the Funko
 * - tipe: Type of the Funko(e.g. POP, POP Rides, Vynil Soda, Vynil Gold, etc.)
 * - genre: Genre of the Funko(e.g. Anime, Movies and TV, Videogames, Sports, Music, etc.)
 * - franchise: Franchise of the Funko(e.g. The Big Bang Theory, Game of Thrones, Sonic The Hedgehog, Marvel etc.)
 * - num_franchise: Number of the Funko in the franchise
 * - exclusive: If the Funko is exclusive or not
 * - special_specs: Special specifications of the Funko
 * - market_value: Market value of the Funko
 */
export interface Funko {
  ID: string;
  name: string;
  description: string;
  type: FunkoType;
  genre: FunkoGenre;
  franchise: string;
  num_franchise: number;
  exclusive: boolean;
  special_specs: string;
  market_value: number;
}
