import React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NewsCard = ({ article }) => {
  const { title, description, url, urlToImage, publishedAt, source, author } = article;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:border-primary-500/50 transition-all hover:shadow-2xl hover:shadow-primary-500/10">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={urlToImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop';
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full shadow-lg">
            {source.name}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDistanceToNow(new Date(publishedAt))} ago
          </div>
          {author && (
            <div className="flex items-center gap-1 line-clamp-1">
              <User size={12} />
              {author}
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-bold line-clamp-2 mb-2 group-hover:text-primary-500 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
          {description || "No description available for this article. Click read more to view the full story on the original source."}
        </p>
        
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
        >
          Read More <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
