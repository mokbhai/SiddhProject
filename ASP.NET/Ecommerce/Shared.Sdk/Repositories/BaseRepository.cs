using FluentValidation;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using Shared.Sdk.Entities;
using Shared.Sdk.Error;
using Shared.Sdk.Error.Exceptions;
using Shared.Sdk.Logger;

using System.Linq.Expressions;

namespace Shared.Sdk.Repositories;

public interface IBaseRepository<TEntity>
{
    public Task<TEntity?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    public Task<List<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);
    public Task<List<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
    public Task<TEntity> CreateAsync(TEntity entity, CancellationToken cancellationToken = default);
    public Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);
    public Task<TEntity> SoftDeleteAsync(TEntity entity, CancellationToken cancellationToken = default);
    public Task<TEntity> SoftDeleteAsync(string id, CancellationToken cancellationToken = default);
    public void HardDeleteAsync(TEntity entity, CancellationToken cancellationToken = default);
}
public class BaseRepository<TEntity, TDbContext> : IBaseRepository<TEntity>
where TEntity : BaseEntity 
where TDbContext : DbContext 
{
    #region Protected Members
    protected readonly ILoggerAdapter<BaseRepository<TEntity, TDbContext>> _logger;

    protected readonly DbSet<TEntity> DbSet;

    protected readonly TDbContext _dbContext;
    #endregion

    #region Private Members
    private IQueryable<TEntity> DbSetQuery => _dbContext.Set<TEntity>().AsNoTracking().AsQueryable();
    #endregion

    protected BaseRepository(ILoggerAdapter<BaseRepository<TEntity, TDbContext>> logger, TDbContext context)
    {
        _dbContext = context;
        _logger = logger;
        DbSet = context.Set<TEntity>();
    }

    /// <summary>
    /// Find specific data by Id 
    /// </summary>    
    public async Task<TEntity?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await DbSetQuery.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
    public virtual async Task<List<TEntity>> GetAllAsync(CancellationToken cancellationToken = default)
    {                                                                   
        return await DbSetQuery.ToListAsync(cancellationToken);
    }

    public virtual async Task<List<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
    {
        return await DbSetQuery.Where(predicate).ToListAsync(cancellationToken);
    }

    public virtual async Task<TEntity> CreateAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        entity.CreatedAtUtc = DateTime.UtcNow;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        DbSet.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        _logger.LogDebug("Entity {EntityId} created successfully", entity.Id);
        return entity;
    }

    public virtual async  Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        entity.UpdatedAtUtc = DateTime.UtcNow;
        DbSet.Attach(entity);
        _dbContext.Entry(entity).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public virtual async  Task<TEntity> SoftDeleteAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        entity.IsDeleted = true;
        DbSet.Attach(entity);
        _dbContext.Entry(entity).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public async Task<TEntity> SoftDeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var entity = await GetByIdAsync(id, cancellationToken) ?? throw new BadRequestException("Not Found");
        await SoftDeleteAsync(entity, cancellationToken);
        return entity;
    }

    public virtual async void HardDeleteAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        DbSet.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
