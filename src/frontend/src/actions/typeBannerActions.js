import { SET_TYPE_BANNERS } from "../constants/ActionTypes";
import axios from "axios";

export const fetchTypeBanners = () => async dispatch => {
    try{
        const response = await axios.get('/api/type-banners');
        dispatch({ type: SET_TYPE_BANNERS, payload: response.data });
    } catch (error) {
        console.error('Error fetching type banners:', error);
    }
}