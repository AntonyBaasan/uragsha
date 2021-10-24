using System.Threading.Tasks;
using Entity.Models;

namespace Entity.Services
{
    public interface ISessionRequestCommentEntityService
    {
        public Task<SessionRequestCommentEntity> AddAsync(SessionRequestCommentEntity entity);

        public Task DeleteAsync(string id);

        public Task<SessionRequestCommentEntity> GetByIdAsync(string id);

        public Task UpdateAsync(SessionRequestCommentEntity entity);

        public Task<bool> ExistAsync(string id);

        public Task<SessionRequestCommentEntity> GetByGivenSessionRequestId(string givenSessionRequestId);

    }
}
