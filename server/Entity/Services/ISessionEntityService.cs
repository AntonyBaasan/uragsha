using System.Threading.Tasks;
using Entity.Models;

namespace Entity.Services
{
    public interface ISessionEntityService
    {
        public Task<SessionEntity> AddAsync(SessionEntity entity);

        public Task DeleteAsync(string id);

        public Task<SessionEntity> GetByIdAsync(string id);

        public Task<SessionEntity> GetBySessionRequestIdAsync(string sessionRequestId);

        public Task UpdateAsync(SessionEntity entity);

        public Task<bool> ExistAsync(string id);

    }
}
