import HTTP_STATUS from '../constants/http-status'
import envConfig from '../config'
import { handleUnauthorized } from '../services/auth.service'
import { getAccessTokenFromLocalStorage, normalizePath } from './utils'


type ServiceName = 'identity' | 'menu' | 'order' | 'reservation'
type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string,
    service?: ServiceName
}

const SERVICE_BASE_URL: Record<ServiceName, string> = {
    identity: envConfig.NEXT_PUBLIC_API_IDENTITY,
    menu: envConfig.NEXT_PUBLIC_API_MENU,
    order: envConfig.NEXT_PUBLIC_API_ORDER,
    reservation: envConfig.NEXT_PUBLIC_API_RESERVATION,
}


export class HttpError extends Error {
    constructor(
        public status: number,
        public payload: {
            message: string;
            [key: string]: any
        },
        message = 'HTTP Error'
    ) {
        super(message)
    }
}

export class EntityError extends HttpError {
    constructor(
        public payload: {
            message: string
            errors: {
                field: string;
                message: string
            }[]
        }
    ) {
        super(HTTP_STATUS.UNPROCESSABLE_ENTITY, payload, 'Entity Error')
        Object.setPrototypeOf(this, EntityError.prototype)
    }
}



const request = async <TResponse>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    options?: CustomOptions
) => {
    // const { baseUrl, ...restOptions } = options ?? {}

    const { baseUrl, service, body: rawBody, headers: rawHeaders, ...restFetchOptions } = options ?? {}

    // ─── 2. Xác định body và Content-Type ────────────────────────────────────
    // Hầu hết các request body có dạng: Json, Form --> 90%
    // 10 % còn lại là Text, XML, Binary,....
    // Code này chưa tối ưu, còn thiếu check 10 % còn lại.

    // Khi body là FormData:
    //   - KHÔNG set Content-Type thủ công
    //   - Browser sẽ tự set "multipart/form-data; boundary=<uuid>" 
    //   - Nếu ta set thủ công thì thiếu boundary → server reject → 415
    // Khi body là object/primitive:
    //   - Stringify thành JSON
    //   - Set Content-Type: application/json
    const isFormData = rawBody instanceof FormData

    const body: BodyInit | undefined = isFormData
        ? rawBody
        : rawBody != null
            ? JSON.stringify(rawBody)
            : undefined

    const baseHeaders: Record<string, string> = isFormData
        ? {}
        : { 'Content-Type': 'application/json' }
    // Auto-attach access token when calling backend services directly (cross-origin).
    // When baseUrl === '' (Next.js route handler), cookies handle auth automatically.
    const isDirectBackendCall = baseUrl !== ''
    const accessToken = getAccessTokenFromLocalStorage()
    const existingAuthHeader = (rawHeaders as Record<string, string>)?.['Authorization']

    if (isDirectBackendCall && accessToken && !existingAuthHeader) {
        baseHeaders['Authorization'] = `Bearer ${accessToken}`
    }

    // const resolvedBaseUrl = baseUrl ?? envConfig.NEXT_PUBLIC_API_IDENTITY // Call API Gateway ????
    const resolvedBaseUrl = baseUrl
        ?? (options?.service ? SERVICE_BASE_URL[options.service] : envConfig.NEXT_PUBLIC_API_IDENTITY)



    const fullUrl = `${resolvedBaseUrl}/${normalizePath(url)}`


    console.log(`fullUrl_______________________: ${fullUrl}`);
    const res = await fetch(fullUrl, {
        ...restFetchOptions,
        headers: { ...baseHeaders, ...(rawHeaders as Record<string, string> ?? {}) },
        body,
        method
    })

    const responseText = await res.text()
    let payload: TResponse
    try {
        payload = JSON.parse(responseText)
    } catch {
        // Response body is empty or not valid JSON
        throw new HttpError(res.status, {
            message: `Server returned ${res.status} with non-JSON response`
        })
    }
    const data = { status: res.status, payload }

    // if fetch URL failed
    if (!res.ok) {
        if (res.status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
            throw new EntityError(payload as any)
        }

        // if error is UnAuthorized
        if (res.status === HTTP_STATUS.UNAUTHORIZED) {
            const tokenFromHeader = (rawHeaders as Record<string, string>)
                ?.['Authorization']
                ?.split('Bearer ')[1] ?? null
            await handleUnauthorized?.(tokenFromHeader)

        }

        throw new HttpError(res.status, payload as any)
    }

    return data
}

const http = {
    get: <TResponse>(url: string, options?: Omit<CustomOptions, 'body'>) =>
        request<TResponse>('GET', url, { ...options }),

    post: <TResponse>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) =>
        request<TResponse>('POST', url, { ...options, body }),

    put: <TResponse>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) =>
        request<TResponse>('PUT', url, { ...options, body }),

    delete: <TResponse>(url: string, options?: Omit<CustomOptions, 'body'>) =>
        request<TResponse>('DELETE', url, options),

    patch: <TResponse>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) =>
        request<TResponse>('PATCH', url, { ...options, body })
}

export default http