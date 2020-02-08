/**
 * @fileOverview Repository for routing actions.
 * @author Patrick Vanegas
 * @version 1.0.0
 */
import axios from 'axios';
import * as dotenv from "dotenv";

dotenv.config();

interface ISQLMethods {
  readonly [method: string]: string,
}

export interface IRequestGeoCoordinates {
    readonly latitude: string,
    readonly longitude: string,
}

export declare interface IReturnGeoCoordinates {
  readonly latitude: number,
  readonly longitude: number,
}


const { SAFE_MAPS_API_KEY } = process.env;

const sql: ISQLMethods = {}

export class RouteRepository {
  public constructor(private readonly db: any, private readonly secret: number) {};

  /**
   * Obtains a desired route from the HERE Maps API given source and destination geolocation objects.
   * @param {IRequestGeoCoordinates} source An object containing the geoposition of the source address
   * @param {IRequestGeoCoordinates} destination An object containing the geoposition of the destination address
   * @returns {Array<IReturnGeoCoordinates>} An Array of coordinates that define the obtained route itself
   */
  public async getRoute(source: IRequestGeoCoordinates, destination: IRequestGeoCoordinates): Promise<Array<IReturnGeoCoordinates>> {
    const sourceLatitude: number = <number>parseFloat(source.latitude);
    const sourceLongitude: number = <number>parseFloat(source.longitude);
    const destinationLatitude: number = <number>parseFloat(destination.latitude);
    const destinationLongitude: number = <number>parseFloat(destination.longitude);

    const routeCoordinates: Array<IReturnGeoCoordinates> = [];
    const routeEndpoint: string = <string>`https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=${SAFE_MAPS_API_KEY}&waypoint0=geo!${sourceLatitude},${sourceLongitude}&waypoint1=geo!${destinationLatitude},${destinationLongitude}&mode=fastest;bicycle;traffic:disabled&legAttributes=shape`;

    try {
      const res = await axios.get(routeEndpoint);
      res.data.response.route[0].leg[0].shape.map((m: { split: (arg0: string) => string[]; }) => {
          const latlong: Array<string> = (m as string).split(',');
          const latitude: number = <number>parseFloat(latlong[0]);
          const longitude: number = <number>parseFloat(latlong[1]);
          routeCoordinates.push({ latitude, longitude });
      });
    } catch (error) {
      return error;
    } finally {
      return routeCoordinates;
    }
  }
}
