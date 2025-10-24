using HelpDeskApi.Data;
using HelpDeskApi.DTOs;
using HelpDeskApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HelpDeskApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AssetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        public AssetsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // [Endpoint]: GET /api/assets
        // [Description]: Returns all assets
        [HttpGet]
        public async Task<IActionResult> GetAssets()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            IQueryable<Asset> query = _context.Assets.Include(a => a.User);
            
            // If user is not admin, only return their assets
            if (userRole != "Admin" && !string.IsNullOrEmpty(userId))
            {
                query = query.Where(a => a.UserID == Guid.Parse(userId));
            }
            
            var assets = await query
                .Select(a => new AssetDto
                {
                    AssetID = a.AssetID,
                    AssetType = a.AssetType,
                    AssetName = a.AssetName,
                    Description = a.Description,
                    UserID = a.UserID,
                    UserName = a.User.FullName
                })
                .ToListAsync();
                
            return Ok(assets);
        }
        
        // [Endpoint]: POST /api/assets
        // [Description]: Creates an asset
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAsset([FromBody] CreateAssetDto assetDto)
        {
            var asset = new Asset
            {
                AssetID = Guid.NewGuid(),
                AssetType = assetDto.AssetType,
                AssetName = assetDto.AssetName,
                Description = assetDto.Description,
                UserID = assetDto.UserID
            };
            
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            
            var user = await _context.Users.FindAsync(asset.UserID);
            
            var result = new AssetDto
            {
                AssetID = asset.AssetID,
                AssetType = asset.AssetType,
                AssetName = asset.AssetName,
                Description = asset.Description,
                UserID = asset.UserID,
                UserName = user?.FullName
            };
            
            return CreatedAtAction(nameof(GetAssets), new { id = asset.AssetID }, result);
        }
    }
}


