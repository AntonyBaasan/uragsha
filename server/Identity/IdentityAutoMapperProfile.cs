using AutoMapper;
using Entity.Models.Identity;
using Identity.Interfaces.Models;

namespace Identity
{
    public class IdentityAutoMapperProfile : Profile
    {
        public IdentityAutoMapperProfile()
        {
            CreateMap<User, UserEntity>();
            CreateMap<UserStat, UserStatEntity>();
            CreateMap<UserRole, UserRoleEntity>();

            CreateMap<UserEntity, User>();
            CreateMap<UserStatEntity, UserStat>();
            CreateMap<UserRoleEntity, UserRole>();
        }
    }
}
