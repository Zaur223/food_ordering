import {Text, TouchableOpacity, Image, Platform, View, ImageSourcePropType} from 'react-native'
import {MenuItem} from "@/type";
import {appwriteConfig} from "@/lib/appwrite";
import {categoryImageMap} from "@/constants";
import {useCartStore} from "@/store/cart.store";

type AnyItem = Partial<MenuItem> & { $id?: string };

const MenuCard = ({ item }: { item: AnyItem }) => {
    const { $id, name } = item;
    const rawImage = (item as any).image_url || (item as any).avatar || (item as any).image || '';

    // Try to find local image from categoryImageMap first
    let imageSource: ImageSourcePropType | undefined;
    if (name) {
        const nameKey = name.toLowerCase();
        for (const [key, img] of Object.entries(categoryImageMap)) {
            if (nameKey.includes(key)) {
                imageSource = img;
                break;
            }
        }
    }

    // Fallback to remote image URL
    let imageUrl = '';
    if (!imageSource) {
        try {
            if (rawImage) {
                if (/^https?:\/\//i.test(rawImage)) imageUrl = rawImage;
                else imageUrl = `${rawImage}?project=${appwriteConfig.projectId}`;
            }
        } catch (_) {
            imageUrl = '';
        }
    }

    const price = (item as any).price;
    const { addItem } = useCartStore();

    return (
        <TouchableOpacity className="menu-card" style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'}: {}}>
            {imageSource ? (
                <Image source={imageSource} className="size-32 absolute -top-10" resizeMode="contain" />
            ) : imageUrl ? (
                <Image source={{ uri: imageUrl }} className="size-32 absolute -top-10" resizeMode="contain" />
            ) : (
                <View className="size-32 absolute -top-10 bg-gray-100" />
            )}
            <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>{name ?? 'No name'}</Text>
            {typeof price !== 'undefined' ? (
                <Text className="body-regular text-gray-200 mb-4">From ${price}</Text>
            ) : (
                <Text className="body-regular text-gray-200 mb-4">&nbsp;</Text>
            )}

            {typeof price !== 'undefined' ? (
                <TouchableOpacity onPress={() => addItem({ id: $id ?? '', name: name ?? 'Item', price: price as number, image_url: imageUrl || '', customizations: []})}>
                    <Text className="paragraph-bold text-primary">Add to Cart +</Text>
                </TouchableOpacity>
            ) : (
                <View style={{ height: 24 }} />
            )}
        </TouchableOpacity>
    )
}
export default MenuCard
