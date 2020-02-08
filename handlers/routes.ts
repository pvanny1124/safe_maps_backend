/**
* @fileOverview Controllers to handle user-account and auth related endpoints
* @author Patrick Vanegas
* @version 1.0.0
*/
import { Request, Response } from 'express';
import { RouteRepository } from '../repositories';
import { IReturnGeoCoordinates, IRequestGeoCoordinates } from '../repositories/routes';
import { celebrate, Joi } from 'celebrate';

export = RouteHandler;

/**
 * Handles enpoints that interact with routing services
 * @namespace RouteHandler
 */
namespace RouteHandler {
  /**
   * Used to validate whether the source and destination are objects and contain two keys
   * for the latitude and longitude in string format.
   */
  export const coordinatesValidation = celebrate({
    body: Joi.object({
      source: Joi.object({
        latitude: Joi.string(),
        longitude: Joi.string(),
      }),
      destination: Joi.object({
        latitude: Joi.string(),
        longitude: Joi.string(),
      }),
    }),
  });

  /**
   * Obtains a route from the HERE Maps API given source and destination objects containing the latitude
   * and longitude of each geoposition.
   * @param {RouteRepository} routeRepository the repository that holds methods to interact with routing
   */
  export function getRoute(routeRepository: RouteRepository) : Function {
    return async function (req: Request, res: Response) : Promise<void> {
      const source: IRequestGeoCoordinates = <IRequestGeoCoordinates>req.body.source;
      const destination: IRequestGeoCoordinates = <IRequestGeoCoordinates>req.body.destination;

      try {
        const routeCoordinates: Array<IReturnGeoCoordinates> = await routeRepository.getRoute(source, destination);
        if (routeCoordinates) {
          res.status(200).json({ routeCoordinates });
          return;
        }
        res.sendStatus(400);
      } catch (error) {
        res.sendStatus(500);
      }
    }
  }
}
