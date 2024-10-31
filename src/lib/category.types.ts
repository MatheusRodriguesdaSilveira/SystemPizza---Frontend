interface CategoryProps {
    id: string
    name: string;
    price: string; 
    description: string;
    banner: string;
    category_id: string; 
}


export interface Props{
    categories: CategoryProps[]
}