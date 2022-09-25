export {}; // makes the file a module so we can augment the global scope

declare global {
  export type Coordinate = {
    x: number;
    y: number;
  };

  export type CoordinateOffset = Coordinate & { offset: number };

  export type Maybe<T> = T | null | undefined;

  export type Quadrilateral = [
    [Coordinate, Coordinate],
    [Coordinate, Coordinate]
  ];
}
