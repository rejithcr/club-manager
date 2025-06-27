export type ClubMemberAttribute = {
  clubMemberAttributeId: number;
  attribute: string;
  attributeValue: string;
  required: number;
  selected?: boolean;
};

type UserInfo = {
    email: string;
    name: string;
    authToken: string;
    photo?: string;
    phone?: string;
}