namespace Common.DataAccess
{
    public interface ICrudService<T>
    {
        public T Create(T obj);
        public T GetById(object id);
        public void Update(object id, T obj);
        public void Delete(object id);
    }
}
