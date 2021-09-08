
using Identity.Interfaces.Identity;

namespace Identity.Entity
{
    public interface IUserEntityService
    {
        public User Create(User user);
        public User GetById(string id);
        public void Update(string id, User user);
        public void Delete(string id);
    }
}
