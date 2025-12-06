export const getDeviceId = () => {
    let id = localStorage.getItem('device_id');

    if (!id) {
        id = `device-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        localStorage.setItem('device_id', id);
    }

    return id;
};