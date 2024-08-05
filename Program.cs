using MongoDB.Driver;
using SJC_Portal.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using Microsoft.OData;
using Microsoft.AspNetCore.OData;
using SJC_Portal;
using MongoDB.Driver.Core.Configuration;
using MongoDB.Bson;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//-------------------------------


//builder.Services.AddSingleton<IMongoClient>(prov =>
//{
//    // Retrieve connection string from configuration
//    return new MongoClient(GeneralData.ConnectionString);
//});

//builder.Services.AddSingleton(prov =>
//{
//    var client = prov.GetRequiredService<IMongoClient>();
//    // Retrieve database name from configuration
//    return client.GetDatabase(GeneralData.ProjectsTableName);
//});

//builder.Services.AddDbContext<ProjectDbContent>((prov, options) =>
//{
//    var database = prov.GetRequiredService<IMongoDatabase>();
//    options.UseMongoDB(
//        database.Client,
//        database.DatabaseNamespace.DatabaseName);
//});

//IEdmModel GetEdmModel()
//{
//    var model = new ODataConventionModelBuilder();
//    model.EnableLowerCamelCase();
//    model.EntitySet<SJC_Project>("API");
//    return model.GetEdmModel();
//}
//---------------------------------
builder.Services.AddControllersWithViews();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
//builder.Services
//    .AddControllers()
//    .AddOData(options => options
//        .Select()
//        .Filter()
//        .OrderBy()
//        .Count()
//        .SetMaxTop(100)
//        .AddRouteComponents("odata", GetEdmModel()));

#region Sessioin and coockies settings
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => { options.IdleTimeout = TimeSpan.FromMinutes(30); });
#endregion


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseSession();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
