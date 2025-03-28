export interface Member {
    id: number;
    clubs: number[];
    firstName: string;
    lastName?: string;
    phone?: number;
    dateOfBirth?: string;
    jerseyNumber?: string;
    jerseyName?: string;
    dues?: number;
}

export let members : Member[] = [
    { "id": 1, "clubs": [1], "firstName": "Rejith", "lastName": "Ramakrishnan", "phone": 8182478848, "dateOfBirth": "30-06-1984", "jerseyNumber": "11", "jerseyName": "Rejith", "dues": 0},
    { "id": 2, "clubs": [1], "firstName": "Sreeram", "lastName": "Ramakrishnan", "phone": 1, "dateOfBirth": "30-06-1984", "jerseyNumber": "11", "jerseyName": "Sree", "dues": 0},
    { "id": 3, "clubs": [1,2], "firstName": "Pra", "lastName": "Ramakrishnan", "phone": 2, "dateOfBirth": "30-06-1984", "jerseyNumber": "2", "jerseyName": "Pra", "dues": 0},
    { "id": 4, "clubs": [2], "firstName": "Ajeesh", "lastName": "Ramakrishnan", "phone": 3, "dateOfBirth": "30-06-1984", "jerseyNumber": "11", "jerseyName": "Aji", "dues": 0},
    { "id": 5, "clubs": [2], "firstName": "Akshay", "lastName": "Divakar", "phone": 8182478848, "dateOfBirth": "30-06-1984", "jerseyNumber": "11", "jerseyName": "Akshay", "dues": 0},
    { "id": 6, "clubs": [1,2], "firstName": "Akshay", "lastName": "Ajith", "phone": 8182478848, "dateOfBirth": "30-06-1984", "jerseyNumber": "11", "jerseyName": "Akshay", "dues": 900},
    { "id": 7, "clubs": [1,2], "firstName": "Akhil", "lastName": "Shaji", "phone": 8182478848, "dateOfBirth": "30-06-1984", "jerseyNumber": "11", "jerseyName": "Akhil", "dues": 0},
    { "id": 8, "clubs": [1], "firstName": "Nevil", "lastName": "Christopher", "phone": 8182478848, "dateOfBirth": "30-06-1984", "jerseyNumber": "0", "jerseyName": "nechri", "dues": 600},
]

export const getMembers = (clubId: number) => {
    return members.filter(member => member.clubs.includes(clubId))
}

export const getMemberDetails = (id: number) => {
    return members.find(member => member.id == id)
}

export const getMemberByPhone = (phoneNumber: number) => {
    return members.find(member => member.phone == phoneNumber)
}