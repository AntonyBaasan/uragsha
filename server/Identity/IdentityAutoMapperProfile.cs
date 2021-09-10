using AutoMapper;
using Entity.Models;
using Identity.Interfaces.Models;

namespace Identity
{
    public class IdentityAutoMapperProfile : Profile
    {
        public IdentityAutoMapperProfile()
        {
            CreateMap<User, UserEntity>();
            CreateMap<UserRole, UserRoleEntity>();

            CreateMap<UserEntity, User>();
            CreateMap<UserRoleEntity, UserRole>();
        }
    }
}
