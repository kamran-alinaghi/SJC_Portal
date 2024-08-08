using Microsoft.Extensions.Primitives;
using MongoDB.Bson;

namespace SJC_Portal.Data
{
    public class UserInfo
    {
        public ObjectId? _id {  get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Name { get; set; }
        public string? Family {  get; set; }
        public string? Email { get; set; }
        public string? StreetAddress { get; set; }
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
        public string? Birthdate { get; set; }
        public string? AccountCreationDate { get; set; }
        public int? AccessLevel { get; set; }

        public UserInfo() {
            _id = null;
        }

    }

    public class UserNpassParam
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }

    public class UserEditParam
    {
        public string? OldUsername { get; set; }
        public string? OldPassword { get; set; }
        public string? NewUsername { get; set; }
        public string? NewPassword { get; set; }
    }
}
