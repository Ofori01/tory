import type { SettingsResponse } from "../types/dtos/settings"
import backendService from "./api.service"
import { endpoints } from "./constants"


class SettingsService {
    async getSettings(){
        const response  = await backendService.get<SettingsResponse>(endpoints.settings)
        return response.data
    }

}


export default new SettingsService()