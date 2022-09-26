import { RequestHandler } from 'express'
import 'reflect-metadata'
import { MetadataKeys } from './MetadataKeys'
import { Methods } from './Methods'

interface RouteHandlerDescriptor extends PropertyDescriptor {
	value?: RequestHandler
}

function routeBinder(method: string) {
	return function (path: string) {
		return function (target: any, key: string, _: RouteHandlerDescriptor) {
			Reflect.defineMetadata(MetadataKeys.path, path, target, key)
			Reflect.defineMetadata(MetadataKeys.method, method, target, key)
		}
	}
}

export const get = routeBinder(Methods.get)
export const put = routeBinder(Methods.put)
export const post = routeBinder(Methods.post)
export const del = routeBinder(Methods.del)
export const patch = routeBinder(Methods.patch)
