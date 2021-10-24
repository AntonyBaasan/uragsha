using System.Linq;
using System.Threading.Tasks;
using Entity.Models;
using Entity.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Entity.MySql.Services
{
    public class SessionRequestCommentEntityService : ISessionRequestCommentEntityService
    {
        private readonly CrudEntityService<SessionRequestCommentEntity> _crudEntityService;
        private readonly IServiceScopeFactory _scopeFactory;

        public SessionRequestCommentEntityService(IServiceScopeFactory scopeFactory)
        {
            _crudEntityService = new CrudEntityService<SessionRequestCommentEntity>(scopeFactory);
            _scopeFactory = scopeFactory;
        }

        public async Task<SessionRequestCommentEntity> AddAsync(SessionRequestCommentEntity entity)
        {
            return await _crudEntityService.AddAsync(entity);
        }

        public async Task DeleteAsync(string id)
        {
            var entity = new SessionRequestCommentEntity() { Id = id };

            await _crudEntityService.DeleteAsync(entity);
        }

        public async Task<SessionRequestCommentEntity> GetByIdAsync(string id)
        {
            return await _crudEntityService.GetByIdAsync(typeof(SessionRequestCommentEntity), id);
        }

        public async Task UpdateAsync(SessionRequestCommentEntity entity)
        {
            await _crudEntityService.UpdateAsync(entity);
        }

        public Task<bool> ExistAsync(string id)
        {
            return _crudEntityService.ExistAsync(typeof(SessionRequestCommentEntity), id);
        }

        private IQueryable<SessionRequestCommentEntity> GetAsQueryable(MainDbContext context)
        {
            return context.SessionRequestComments.AsQueryable();
        }


    }
}
