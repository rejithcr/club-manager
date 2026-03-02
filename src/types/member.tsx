export type ClubMemberAttribute = {
  clubMemberAttributeId: number;
  attribute: string;
  attributeValue: string;
  required: number;
  selected?: boolean;
};

export interface Member {
    memberId: number | string | undefined;
    firstName: string;
    lastName?: string;
    phone?: number;
    email?: string;
    photo?: string;
    updatedBy?: string | undefined;
    dateOfBirth?: Date;
    role?: string;
    isRegistered?: number,
    createdTs?: string,
    updatedTs?: string,
    lastAccessedOn?: string,
    roleName?: string;
}

export interface BirthdayMember {
    memberId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    photo?: string;
    dateOfBirth: string;
    birthday: string;
    daysUntilBirthday: number;
    clubNames: string; // Comma-separated club names
    clubCount: number; // Number of clubs
    primaryClubId: number; // For potential navigation
}

export interface FeedItem {
    type: 'event' | 'birthday';
    date: Date;
    sortKey: number; // For sorting (days until for birthdays, date for events)
    data: any; // Event or BirthdayMember data
}