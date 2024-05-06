from pydantic import BaseModel
from fastapi import FastAPI
import pandas as pd
from ast import literal_eval
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

# Get data
md = pd.read_csv('data/movie.csv').drop_duplicates(subset="id").reset_index(drop=True) # processing data
df = pd.read_csv('data/movie.csv').drop_duplicates(subset="id").reset_index(drop=True) # original data
genres = pd.read_csv("data/genres.csv")

# Processing data
md['overview'] = md['overview'].fillna('')
md['overview'] = md['overview'].apply(lambda x: x.split(" "))
genre_dict = dict(zip(genres['id'], genres['name']))
md['genre_ids'] = md['genre_ids'].apply(literal_eval)
md['genres'] = md['genre_ids'].apply(lambda x: [genre_dict[i] for i in x])
md['soup'] =  md["genres"]*5 + md["overview"] 
md['soup'] = md['soup'].apply(lambda x: ' '.join(x))

# Vectorizer data
count = TfidfVectorizer(analyzer='word',ngram_range=(1, 2),min_df=1, stop_words='english')
count_matrix = count.fit_transform(md['soup'])

# Calculate Cosine Similarity
cosine_sim = cosine_similarity(count_matrix, count_matrix)

# Indexing
indices = pd.Series(md.index, index=md['id'])

def filter_movie_ids(movie_ids):
    acpt = [val for val in movie_ids if val in indices]
    if len(acpt) == 0:
        return [indices.sample(n=1).index[0]]
    else:
        return acpt


# Recommendation based on user's favorite movies
def get_recommendations(movie_ids):
    movie_ids = filter_movie_ids(movie_ids)
    recommendations = {}
    row_numbers = [indices.index.get_loc(id) for id in movie_ids]
    for id in movie_ids:
        idx = indices[id] 
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[:100]
        sim_scores = [(m, score) for m, score in sim_scores if m not in row_numbers]
        for i in range(30):
            if sim_scores[i][0] in recommendations:
                recommendations[sim_scores[i][0]] += sim_scores[i][1]
            else:
                recommendations[sim_scores[i][0]] = sim_scores[i][1]
        
    recommendations = {k: v for k, v in sorted(recommendations.items(), key=lambda x: x[1],reverse=True)}
    movie_indices = [i for i in recommendations]
    return df.iloc[movie_indices].head(30)

app = FastAPI()

class reqRecommend(BaseModel): 
    fav_movie_ids: list[int]

    
@app.post("/v1/ai/recommend")
def read_root(req: reqRecommend):
    response = get_recommendations(req.fav_movie_ids)
    return {
        "recommend_ids":json.loads(response.to_json(orient='records'))
    }
