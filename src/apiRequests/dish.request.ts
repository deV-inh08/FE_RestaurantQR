import { DishStatus } from "@/src/constants/dish-status";
import http from "../lib/http";
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from "../schema/dish.schema";

// Always call Services Backend: Don't allow call Next Server 
const dishApiRequest = {
    // get list dishes
    list: () => http.get<DishListResType>(
        '/menu/dishes',
        { next: { tags: ['dishes'] }, service: "menu" },

    ),
    add: (body: CreateDishBodyType) => {
        const formData = new FormData()
        formData.append('name', body.name)
        formData.append('price', String(body.price))
        formData.append('description', body.description ?? '')
        formData.append('category', body.category)
        formData.append('status', body.status ?? DishStatus.Available)
        if (body.image instanceof File) {
            // Arg 3: filename — server dùng để lưu hoặc log
            formData.append('image', body.image, body.image.name)
        }

        return http.post<DishResType>('/menu/dishes', formData, { service: 'menu' })
    },
    getDish: (id: number) => http.get<DishResType>(`/menu/dishes/${id}`, { service: "menu" }),
    updateDish: (id: number, body: UpdateDishBodyType) => http.put<DishResType>(`/menu/dishes/${id}`, body, { service: "menu" }),
    deleteDish: (id: number) => http.delete<DishResType>(`/menu/dishes/${id}`, { service: "menu" }),
    updateStatusDish: (id: number, body: { status: typeof DishStatus[keyof typeof DishStatus] }) => http.put<DishResType>(`/menu/dishes/${id}/status`, body, { service: "menu" })
}

export default dishApiRequest