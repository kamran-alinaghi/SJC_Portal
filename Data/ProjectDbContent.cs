using Microsoft.EntityFrameworkCore;
using MongoDB.Bson;
using MongoDB.EntityFrameworkCore.Extensions;

namespace SJC_Portal.Data
{
    public class ProjectDbContent : DbContext
    {
        public ProjectDbContent() { }
        public ProjectDbContent(DbContextOptions options)
        : base(options)
        {
        }

        public DbSet<SJC_Project> SJC_Projects { get; init; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            var Entity = modelBuilder.Entity<SJC_Project>();
            Entity.ToCollection("SJC_Projects");
        }
    }
}
