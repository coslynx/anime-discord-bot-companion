import axios from 'axios';
import { getAccessToken } from './auth';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAnimeById = async (id: number) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${apiUrl}/anime/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
};

export const getAnimeLists = async (userId: number) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${apiUrl}/list?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching anime lists:', error);
    throw error;
  }
};

export const getCharacter = async (userId: number) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${apiUrl}/mmorpg?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data[0];
  } catch (error) {
    console.error('Error fetching MMORPG character:', error);
    throw error;
  }
};

export const createCharacter = async (name: string, anime?: string) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${apiUrl}/mmorpg`,
      { name, anime },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating MMORPG character:', error);
    throw error;
  }
};

export const levelUp = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.patch(`${apiUrl}/mmorpg/levelup`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error leveling up:', error);
    throw error;
  }
};

export const battle = async (target: string) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${apiUrl}/mmorpg/battle`,
      { target },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error battling:', error);
    throw error;
  }
};

export const getInventory = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${apiUrl}/mmorpg/inventory`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

export const getShopItems = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${apiUrl}/mmorpg/shop`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching shop items:', error);
    throw error;
  }
};

export const purchaseItem = async (itemId: number) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(
      `${apiUrl}/mmorpg/purchase`,
      { itemId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error purchasing item:', error);
    throw error;
  }
};