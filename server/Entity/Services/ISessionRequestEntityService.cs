using System.Collections.Generic;
using System.Threading.Tasks;
using Entity.Models;

namespace Entity.Services
{
    public interface ISessionRequestEntityService
    {
        public Task<SessionRequestEntity> AddAsync(SessionRequestEntity entity);

        public Task DeleteAsync(string id);

        public Task DeleteAsync(string id, string userId);

        public Task<SessionRequestEntity> GetByIdAsync(string id);

        public Task<SessionRequestEntity> GetByIdAsync(string id, string userId);

        public Task UpdateAsync(SessionRequestEntity entity);

        public Task<bool> ExistAsync(string id);

        public Task<List<SessionRequestEntity>> FindByUserIdAsync(string userId);

        public Task<List<SessionRequestEntity>> FindAsync(SessionRequestQueryParam userId);
    }
}
