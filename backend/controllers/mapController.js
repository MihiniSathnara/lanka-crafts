import User from '../models/User.js';

export const getArtistLocations = async (req, res) => {
  try {
    const artists = await User.find({
      role: 'artist',
      'workshopLocation.lat': { $exists: true, $ne: null },
      'workshopLocation.lng': { $exists: true, $ne: null },
    }).select('name avatar workshopName workshopLocation craftSpecialization');

    const locations = artists
      .filter((a) => a.workshopLocation?.lat && a.workshopLocation?.lng)
      .map((a) => ({
        _id: a._id,
        name: a.name,
        avatar: a.avatar,
        workshopName: a.workshopName,
        address: a.workshopLocation.address,
        lat: a.workshopLocation.lat,
        lng: a.workshopLocation.lng,
        craftSpecialization: a.craftSpecialization,
      }));

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
