ROLE_ADMIN=1
ROLE_MAINTAINER=2
ROLE_MEMBER=3

PII_ATTRIBUTES = [
    { "attribute": 'First Name',  "selected": False , "clubMemberAttributeId": -1, "required": 1 },
    { "attribute": 'Last Name',  "selected": False, "clubMemberAttributeId": -2, "required": 1 },
    { "attribute": 'Email',  "selected": False, "clubMemberAttributeId": -3, "required": 1 },
    { "attribute": 'Phone',  "selected": False, "clubMemberAttributeId": -4, "required": 1 },
    { "attribute": 'Date of Birth',  "selected": False, "clubMemberAttributeId": -5, "required": 1 },
];

PII_ATTRIBUTES_MAPPING = [
    {'key': -1, 'label': "first_name"},
    {'key': -2, 'label': "last_name"},
    {'key': -3, 'label': "email"},
    {'key': -4, 'label': "phone"},
    {'key': -5, 'label': "date_of_birth"}
]

CORS_ORIGINS = ["http://localhost:8081"]

WEB_CLIENT_ID_1="586660286227-lsrcprib6rmjvsnhsirc9dtpf46vvnb3.apps.googleusercontent.com"
WEB_CLIENT_ID_2="586660286227-j9a6t8mh8g0c8s3brt7cn413ckcnlj3b.apps.googleusercontent.com"